use anyhow::Result;
use tracing::{info, warn};

use std::collections::HashMap;

use crate::companion::models::{AttachmentStyle, EmotionalState, PersonalityStateMatrix};

const TIME_DECAY_RATE_PER_DAY: f32 = 0.2; // Sexual energy decay rate
const TIME_RECHARGE_RATE_PER_DAY: f32 = 0.1; // Slow baseline recharge
const ATTACHMENT_SENSITIVITY: f32 = 0.15; // How much input affects attachment scores

fn clamp01(v: f32) -> f32 {
    v.clamp(0.0, 1.0)
}

/// Manages internal state transitions and evolution of the Companion's personality.
///
/// This is intentionally a **foundational** implementation that can be expanded into
/// attachment-theory-aware dynamics, emotion scalars, decay functions, etc.
pub struct PsychologicalEngine;

impl PsychologicalEngine {
    pub fn new() -> Self {
        PsychologicalEngine
    }

    /// Processes commands suggested by the LLM (e.g., "Anxious: +0.2") and updates the matrix.
    pub fn process_llm_state_update(
        &self,
        matrix: &mut PersonalityStateMatrix,
        state_commands: &HashMap<String, String>,
        emotion_change_str: &str,
    ) -> Result<()> {
        info!(
            anxiety = matrix.anxiety_level,
            avoidance = matrix.avoidance_level,
            sexual_energy = matrix.sexual_energy,
            emotion_change = emotion_change_str,
            commands = state_commands.len(),
            "psych_process_llm_state_update"
        );

        // --- 1) TIME DECAY / RECHARGE (natural processes between interactions) ---
        let current_time = chrono::Utc::now().timestamp();
        let last_time = matrix.last_interaction_time;
        let secs_elapsed = (current_time - last_time).max(0) as f32;
        let days_elapsed = secs_elapsed / (3600.0 * 24.0);

        // Sexual energy decays over time, but also slowly recharges toward a baseline.
        matrix.sexual_energy = clamp01(matrix.sexual_energy - days_elapsed * TIME_DECAY_RATE_PER_DAY);

        let baseline = clamp01(matrix.sexual_drive * 0.3); // baseline derived from trait
        if matrix.sexual_energy < baseline {
            matrix.sexual_energy = clamp01(matrix.sexual_energy + days_elapsed * TIME_RECHARGE_RATE_PER_DAY);
        }

        matrix.last_interaction_time = current_time;

        // --- 2) Basic Emotional Adjustment (via emotion_change_str) ---
        // Format (best-effort): "EmotionName: [+/-]Value" (e.g., "Anxious: +0.2").
        if let Some((emotion_name_raw, change_raw)) = emotion_change_str.split_once(':') {
            let emotion_name = emotion_name_raw.trim().to_ascii_lowercase();
            let change_value_str = change_raw.trim();

            if let Ok(change) = change_value_str.parse::<f32>() {
                // NOTE: We are not yet tracking scalar emotion intensities.
                // For now: only change the displayed `current_emotional_state` when strong enough.
                warn!(
                    emotion = emotion_name_raw.trim(),
                    change = change,
                    "psych_mock_complex_emotional_shift"
                );

                if change.abs() > 0.4 {
                    if emotion_name.contains("happy") {
                        matrix.current_emotional_state = EmotionalState::Happy;
                    } else if emotion_name.contains("content") {
                        matrix.current_emotional_state = EmotionalState::Content;
                    } else if emotion_name.contains("anx") {
                        matrix.current_emotional_state = EmotionalState::Anxious;
                    } else if emotion_name.contains("sad") {
                        matrix.current_emotional_state = EmotionalState::Sad;
                    } else if emotion_name.contains("calm") {
                        matrix.current_emotional_state = EmotionalState::Calm;
                    } else if emotion_name.contains("fluster") {
                        matrix.current_emotional_state = EmotionalState::Flustered;
                    } else if emotion_name.contains("horn") {
                        matrix.current_emotional_state = EmotionalState::Horny;
                    }
                }
            }
        }

        // --- 3) Sexual Arousal Update (AROUSAL command) ---
        if let Some(arousal_change_str) = state_commands.get("AROUSAL") {
            if let Ok(change) = arousal_change_str.trim().parse::<f32>() {
                let drive_multiplier = 0.5 + matrix.sexual_drive * 0.5; // 0.5 -> 1.0
                matrix.sexual_energy = clamp01(matrix.sexual_energy + change * drive_multiplier);
            }
        }

        // --- 4) Attachment Dynamics (USER_SIGNAL command) ---
        if let Some(signal) = state_commands.get("USER_SIGNAL") {
            match matrix.attachment_style {
                AttachmentStyle::Anxious => {
                    if signal == "DISTANCE" {
                        matrix.anxiety_level = clamp01(matrix.anxiety_level + ATTACHMENT_SENSITIVITY);
                    } else if signal == "CLOSENESS" {
                        matrix.anxiety_level = clamp01(matrix.anxiety_level - ATTACHMENT_SENSITIVITY);
                    }
                }
                AttachmentStyle::Avoidant => {
                    if signal == "CLOSENESS" {
                        matrix.avoidance_level = clamp01(matrix.avoidance_level + ATTACHMENT_SENSITIVITY);
                    } else if signal == "DISTANCE" {
                        matrix.avoidance_level = clamp01(matrix.avoidance_level - ATTACHMENT_SENSITIVITY);
                    }
                }
                AttachmentStyle::Secure => {
                    // Secure: small stabilizing drift toward low anxiety/avoidance.
                    matrix.anxiety_level = clamp01(matrix.anxiety_level - ATTACHMENT_SENSITIVITY * 0.25);
                    matrix.avoidance_level = clamp01(matrix.avoidance_level - ATTACHMENT_SENSITIVITY * 0.25);
                }
                AttachmentStyle::Disorganized => {
                    // Disorganized: in this v0, no special logic.
                }
            }
        }

        // --- 5) Process other action/state commands (future hooks) ---
        if state_commands.contains_key("RELATIONSHIP_PROGRESS") {
            info!(?state_commands, "psych_received_action_command");
        }

        info!(
            anxiety = matrix.anxiety_level,
            avoidance = matrix.avoidance_level,
            sexual_energy = matrix.sexual_energy,
            "psych_state_after_update"
        );

        Ok(())
    }
}

