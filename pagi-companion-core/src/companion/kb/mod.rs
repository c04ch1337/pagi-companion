use anyhow::{bail, Result};
use async_trait::async_trait;
use tokio::fs;
use tokio::io::AsyncWriteExt;
use tracing::{info, warn};

use crate::security::AgentIdentity;

use crate::companion::models::{
    AttachmentStyle, EmotionalState, FlirtyStyle, LoveLanguage, PersonalityStateMatrix,
    RelationshipStage,
};
use crate::rag::embedding::EmbeddingModel;
use crate::rag::index::VectorIndex;

/// Trait defining the core long-term memory functions for the Agentic RAG loop.
#[async_trait]
pub trait KnowledgeBase {
    /// Stores a piece of information, returning a unique memory ID.
    async fn store(&self, user_id: &str, content: &str) -> Result<String>;

    /// Retrieves relevant context based on a natural language query.
    async fn retrieve_context_by_query(&self, user_id: &str, query: &str, k: usize)
        -> Result<Vec<String>>;
}

/// Placeholder for the structured fact store (semantic memory/state).
pub struct SemanticKB;

impl SemanticKB {
    /// Defines the data path relative to the runtime directory.
    const DATA_DIR: &'static str = "./companion_data";

    pub fn new() -> Self {
        SemanticKB
    }

    fn get_file_path(&self, user_id: &str) -> String {
        format!("{}/{}.json", Self::DATA_DIR, user_id)
    }

    fn get_identity_file_path(&self, user_id: &str) -> String {
        format!("{}/{}_identity.json", Self::DATA_DIR, user_id)
    }

    fn create_default_matrix(&self, _user_id: &str) -> PersonalityStateMatrix {
        let now = chrono::Utc::now().timestamp();
        PersonalityStateMatrix {
            name: "Skylar".to_string(),
            gender: "Female".to_string(),
            primary_role: "Flirty Girlfriend".to_string(),

            conservatism_level: 0.2,
            sexual_drive: 0.8,
            intimacy_openness: 0.9,

            attachment_style: AttachmentStyle::Secure,
            love_language: LoveLanguage::PhysicalTouch,
            flirty_style: FlirtyStyle::Bold,
            current_emotional_state: EmotionalState::Happy,
            relationship_stage: RelationshipStage::Dating,
            current_kinks_list: vec!["praise".to_string(), "teasing".to_string()],
            current_boundaries_list: vec!["safe word 'exit'".to_string()],

            anxiety_level: 0.1,
            avoidance_level: 0.1,
            sexual_energy: 0.5,
            last_interaction_time: now,
        }
    }

    /// Loads the full structured personality and state data from a file.
    pub async fn load_matrix_by_user_id(&self, user_id: &str) -> Result<PersonalityStateMatrix> {
        let file_path = self.get_file_path(user_id);
        info!(user_id = user_id, file_path = file_path.as_str(), "kb_load_matrix");

        match fs::read(&file_path).await {
            Ok(data) => {
                let matrix: PersonalityStateMatrix = serde_json::from_slice(&data)?;
                info!(user_id = user_id, "kb_state_loaded");
                Ok(matrix)
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                warn!(user_id = user_id, "kb_state_not_found_creating_default");
                fs::create_dir_all(Self::DATA_DIR).await?;

                let default_matrix = self.create_default_matrix(user_id);
                self.save_matrix(user_id, &default_matrix).await?;
                Ok(default_matrix)
            }
            Err(e) => bail!("Failed to read state file {}: {}", file_path, e),
        }
    }

    /// Saves the updated matrix and state data to a file.
    pub async fn save_matrix(&self, user_id: &str, matrix: &PersonalityStateMatrix) -> Result<()> {
        fs::create_dir_all(Self::DATA_DIR).await?;

        let file_path = self.get_file_path(user_id);
        info!(user_id = user_id, file_path = file_path.as_str(), "kb_save_matrix");

        let data = serde_json::to_vec_pretty(matrix)?;
        let mut file = fs::File::create(&file_path).await?;
        file.write_all(&data).await?;
        Ok(())
    }

    /// Loads the `AgentIdentity` from storage, generating a new one if not found.
    pub async fn load_agent_identity(&self, user_id: &str) -> Result<AgentIdentity> {
        fs::create_dir_all(Self::DATA_DIR).await?;

        let file_path = self.get_identity_file_path(user_id);
        info!(user_id = user_id, file_path = file_path.as_str(), "kb_load_agent_identity");

        match fs::read(&file_path).await {
            Ok(data) => {
                let identity: AgentIdentity = serde_json::from_slice(&data)?;
                info!(user_id = user_id, "kb_identity_loaded");
                Ok(identity)
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                warn!(user_id = user_id, "kb_identity_not_found_generating");
                let new_identity = AgentIdentity::new_with_generation(format!("PAGI-{user_id}"));
                self.save_agent_identity(user_id, &new_identity).await?;
                Ok(new_identity)
            }
            Err(e) => bail!("Failed to read identity file {}: {}", file_path, e),
        }
    }

    /// Saves the `AgentIdentity` to storage.
    pub async fn save_agent_identity(&self, user_id: &str, identity: &AgentIdentity) -> Result<()> {
        fs::create_dir_all(Self::DATA_DIR).await?;

        let file_path = self.get_identity_file_path(user_id);
        info!(user_id = user_id, file_path = file_path.as_str(), "kb_save_agent_identity");

        let data = serde_json::to_vec_pretty(identity)?;
        let mut file = fs::File::create(&file_path).await?;
        file.write_all(&data).await?;
        Ok(())
    }
}

/// Functional episodic memory store (RAG) backed by an in-memory vector index.
pub struct EpisodicKB {
    embedding_model: EmbeddingModel,
    /// Separate index per user_id (bare-metal isolation).
    per_user_index: tokio::sync::RwLock<std::collections::HashMap<String, VectorIndex>>,
}

impl EpisodicKB {
    const DATA_DIR: &'static str = "./companion_data";

    pub fn new() -> Self {
        EpisodicKB {
            embedding_model: EmbeddingModel::new(),
            per_user_index: tokio::sync::RwLock::new(std::collections::HashMap::new()),
        }
    }

    fn rag_file_path(&self, user_id: &str) -> String {
        format!("{}/{}_rag_index.json", Self::DATA_DIR, user_id)
    }

    async fn ensure_index_loaded(&self, user_id: &str) -> Result<()> {
        {
            // Fast-path: already loaded.
            let guard = self.per_user_index.read().await;
            if guard.contains_key(user_id) {
                return Ok(());
            }
        }

        tokio::fs::create_dir_all(Self::DATA_DIR).await?;
        let file_path = self.rag_file_path(user_id);

        let mut guard = self.per_user_index.write().await;
        if guard.contains_key(user_id) {
            return Ok(());
        }

        match tokio::fs::read(&file_path).await {
            Ok(data) => {
                let idx = VectorIndex::from_json_bytes(&data)?;
                guard.insert(user_id.to_string(), idx);
                info!(user_id = user_id, file_path = file_path.as_str(), "kb_rag_index_loaded");
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                guard.insert(user_id.to_string(), VectorIndex::new());
                info!(user_id = user_id, file_path = file_path.as_str(), "kb_rag_index_created");
            }
            Err(e) => bail!("Failed to read RAG index file {}: {}", file_path, e),
        }

        Ok(())
    }

    async fn save_index(&self, user_id: &str) -> Result<()> {
        tokio::fs::create_dir_all(Self::DATA_DIR).await?;
        let file_path = self.rag_file_path(user_id);

        // Clone the index to avoid holding a lock during serialization + IO.
        let idx = {
            let guard = self.per_user_index.read().await;
            guard
                .get(user_id)
                .cloned()
                .unwrap_or_else(VectorIndex::new)
        };

        let bytes = idx.to_json_bytes()?;
        tokio::fs::write(&file_path, bytes).await?;
        info!(user_id = user_id, file_path = file_path.as_str(), "kb_rag_index_saved");
        Ok(())
    }
}

#[async_trait]
impl KnowledgeBase for EpisodicKB {
    async fn store(&self, user_id: &str, content: &str) -> Result<String> {
        info!(user_id = user_id, "kb_store_episodic_memory_rag");

        self.ensure_index_loaded(user_id).await?;

        let embedding = self.embedding_model.embed_text(content)?;
        let mut guard = self.per_user_index.write().await;
        let index = guard
            .entry(user_id.to_string())
            .or_insert_with(VectorIndex::new);
        let id = index.add(content.to_string(), embedding);

        // Persist index after each write (research-friendly durability).
        drop(guard);
        self.save_index(user_id).await?;

        Ok(format!("mem-{}-{}", user_id, id))
    }

    async fn retrieve_context_by_query(
        &self,
        user_id: &str,
        query: &str,
        k: usize,
    ) -> Result<Vec<String>> {
        info!(user_id = user_id, k = k, query = query, "kb_retrieve_context_by_query_rag");

        self.ensure_index_loaded(user_id).await?;

        let query_vector = self.embedding_model.embed_text(query)?;

        let guard = self.per_user_index.read().await;
        let Some(index) = guard.get(user_id) else {
            return Ok(vec![]);
        };

        let context = index.search(&query_vector, k);
        info!(user_id = user_id, retrieved = context.len(), "kb_retrieve_context_done");
        Ok(context)
    }
}

