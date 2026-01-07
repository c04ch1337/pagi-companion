use anyhow::Result;
use rand::{Rng, SeedableRng};
use sha2::Digest;

/// Defines the vector dimension used for all embeddings.
pub const EMBEDDING_DIMENSION: usize = 384;

/// MOCK: A stable, embedded "embedding model".
///
/// This is intentionally deterministic so tests and local dev are repeatable.
pub struct EmbeddingModel;

impl EmbeddingModel {
    pub fn new() -> Self {
        EmbeddingModel
    }

    /// Converts text content into a fixed-size vector embedding.
    pub fn embed_text(&self, text: &str) -> Result<Vec<f32>> {
        // Create a stable seed from the text bytes using SHA-256 (already in the stack).
        let digest = sha2::Sha256::digest(text.as_bytes());
        let seed = u64::from_le_bytes(digest[0..8].try_into().unwrap());

        let mut rng = rand::rngs::StdRng::seed_from_u64(seed);
        let embedding: Vec<f32> = (0..EMBEDDING_DIMENSION)
            .map(|_| rng.gen_range(-0.5..0.5))
            .collect();
        Ok(embedding)
    }
}

