use anyhow::Result;
use tracing::info;
use uuid::Uuid;

use crate::brain::tactical_llm::TacticalLLM;
use crate::companion::kb::{EpisodicKB, KnowledgeBase, SemanticKB};
use crate::companion::models::StructuredLLMOutput;
use crate::companion::psychology::PsychologicalEngine;
use crate::prime_core::models::{PhaseResult, PhaseStatus};
use crate::security::AgentIdentity;

/// The specialized agent for AI Girlfriend/Boyfriend logic, utilizing Agentic RAG.
pub struct CompanionAgent {
    tactical_llm: TacticalLLM,
    /// Assumption: `user_id` is the unique identifier for the user/companion session.
    user_id: String,

    // Agentic RAG components
    semantic_kb: SemanticKB, // structured facts/state
    episodic_kb: EpisodicKB, // vector memory search

    // Psychological modeling engine
    psych_engine: PsychologicalEngine,

    // Secure, persistent identity
    agent_identity: AgentIdentity,
}

impl CompanionAgent {
    pub async fn new(user_id: String) -> Result<Self> {
        let semantic_kb = SemanticKB::new();
        let identity = semantic_kb.load_agent_identity(&user_id).await?;

        let tactical_llm = TacticalLLM::new()?;

        Ok(CompanionAgent {
            tactical_llm,
            user_id,
            semantic_kb,
            episodic_kb: EpisodicKB::new(),
            psych_engine: PsychologicalEngine::new(),
            agent_identity: identity,
        })
    }

    /// The primary method that translates user input into a dynamic, personalized response.
    pub async fn execute_response(&mut self, user_input: &str) -> Result<PhaseResult> {
        info!(
            user_id = self.user_id.as_str(),
            agent_id = self.agent_identity.agent_id.as_str(),
            "companion_execute_response_start"
        );

        // 1) DIRECT LOOKUP (Semantic KB): load current personality state.
        let mut personality_matrix = self
            .semantic_kb
            .load_matrix_by_user_id(&self.user_id)
            .await?;

        // 2) SEMANTIC RETRIEVAL (Episodic KB): find contextually relevant memories.
        let relevant_memories = self
            .episodic_kb
            .retrieve_context_by_query(&self.user_id, user_input, 5)
            .await?;

        // 3) BUILD AUGMENTED LLM INPUT.
        let system_prompt = personality_matrix.to_system_prompt_string();
        let memory_injection = format!(
            "--- CONTEXTUAL MEMORIES ---\n{}",
            relevant_memories.join("\n")
        );

        info!(
            user_id = self.user_id.as_str(),
            memories = relevant_memories.len(),
            "companion_prompt_augmented"
        );

        // 4) GENERATE STRUCTURED OUTPUT.
        let structured_llm_output: StructuredLLMOutput = self
            .tactical_llm
            .generate_structured_output(&system_prompt, &memory_injection, user_input)
            .await?;

        let response_text = structured_llm_output.response.clone();

        // 5) APPLY STATE CHANGES & MEMORY STORAGE.
        self.psych_engine.process_llm_state_update(
            &mut personality_matrix,
            &structured_llm_output.state_commands,
            &structured_llm_output.suggested_emotion_change,
        )?;
        self.semantic_kb
            .save_matrix(&self.user_id, &personality_matrix)
            .await?;

        if let Some(new_memory) = &structured_llm_output.suggested_memory_add {
            let _memory_id = self
                .episodic_kb
                .store(&self.user_id, new_memory.as_str())
                .await?;
        }

        // 6) RETURN FINAL RESULT.
        Ok(PhaseResult {
            phase_id: Uuid::new_v4(),
            status: PhaseStatus::Completed,
            report_summary: response_text,
            raw_data_path: format!("/sessions/{}/response.json", self.user_id),
            requires_human_attention: false,
        })
    }
}

