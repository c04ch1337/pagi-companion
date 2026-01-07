use anyhow::Result;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MemoryItem {
    id: u64,
    embedding: Vec<f32>,
    content: String,
}

/// An in-memory vector index for episodic memory.
///
/// NOTE: This is intentionally simple (Euclidean distance + full scan). It is a
/// functional stand-in for embedded ANN indices.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VectorIndex {
    items: Vec<MemoryItem>,
    next_id: u64,
}

impl VectorIndex {
    pub fn new() -> Self {
        VectorIndex {
            items: Vec::new(),
            next_id: 0,
        }
    }

    pub fn add(&mut self, text_content: String, embedding: Vec<f32>) -> u64 {
        let id = self.next_id;
        self.next_id += 1;
        self.items.push(MemoryItem {
            id,
            embedding,
            content: text_content,
        });
        info!(memory_id = id, "rag_memory_stored");
        id
    }

    /// Performs a similarity search for the top-k vectors using Euclidean distance.
    pub fn search(&self, query_vector: &[f32], k: usize) -> Vec<String> {
        if self.items.is_empty() || k == 0 {
            return vec![];
        }

        // Compute distances (optionally parallel for larger memory sets).
        let mut distances: Vec<(f32, u64)> = if self.items.len() >= 64 {
            self.items
                .par_iter()
                .map(|item| (euclidean_distance(&item.embedding, query_vector), item.id))
                .collect()
        } else {
            self.items
                .iter()
                .map(|item| (euclidean_distance(&item.embedding, query_vector), item.id))
                .collect()
        };

        distances.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap_or(std::cmp::Ordering::Equal));

        distances
            .into_iter()
            .take(k)
            .filter_map(|(_, id)| self.items.iter().find(|it| it.id == id))
            .map(|it| it.content.clone())
            .collect()
    }

    pub fn to_json_bytes(&self) -> Result<Vec<u8>> {
        Ok(serde_json::to_vec_pretty(self)?)
    }

    pub fn from_json_bytes(bytes: &[u8]) -> Result<Self> {
        Ok(serde_json::from_slice(bytes)?)
    }
}

fn euclidean_distance(a: &[f32], b: &[f32]) -> f32 {
    // Treat mismatched dims as min-dim comparison.
    let n = a.len().min(b.len());
    let sum_sq: f32 = a
        .iter()
        .take(n)
        .zip(b.iter().take(n))
        .map(|(x, y)| (x - y) * (x - y))
        .sum();
    sum_sq.sqrt()
}

