pub mod brain;
pub mod companion;
pub mod rag;
pub mod security;

/// Verifies the Episodic RAG persistence pipeline by running a store->save->load->retrieve cycle.
///
/// This is intended as a bare-metal research sanity check.
pub async fn verify_rag_pipeline(user_id: &str) -> anyhow::Result<Vec<String>> {
    use crate::companion::kb::{EpisodicKB, KnowledgeBase};

    // 1) Create a KB instance and store a memory (this should persist).
    let kb = EpisodicKB::new();
    kb.store(user_id, "User's dog is named Sparky.").await?;
    kb.store(user_id, "User prefers late-night chats.").await?;

    // 2) Create a fresh KB instance (forces load from disk).
    let kb2 = EpisodicKB::new();
    let ctx = kb2
        .retrieve_context_by_query(user_id, "What is my dog's name?", 3)
        .await?;

    Ok(ctx)
}

/// Minimal placeholders so the new `CompanionAgent` can return a typed result
/// without depending on other crates that are not present in this repo yet.
///
/// This mirrors the (referenced) `crate::prime_core::models::*` path.
pub mod prime_core {
    pub mod models {
        use serde::{Deserialize, Serialize};
        use uuid::Uuid;

        #[derive(Debug, Clone, Serialize, Deserialize)]
        pub struct PhaseTask;

        #[derive(Debug, Clone, Serialize, Deserialize)]
        pub enum PhaseStatus {
            Pending,
            Completed,
            Failed,
        }

        #[derive(Debug, Clone, Serialize, Deserialize)]
        pub struct PhaseResult {
            pub phase_id: Uuid,
            pub status: PhaseStatus,
            pub report_summary: String,
            pub raw_data_path: String,
            pub requires_human_attention: bool,
        }
    }
}

