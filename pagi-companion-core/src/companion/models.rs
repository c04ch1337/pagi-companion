use serde::{Deserialize, Serialize};
use std::collections::HashMap;

fn default_anxiety_level() -> f32 {
    0.1
}

fn default_avoidance_level() -> f32 {
    0.1
}

fn default_sexual_energy() -> f32 {
    0.5
}

fn default_last_interaction_time() -> i64 {
    chrono::Utc::now().timestamp()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AttachmentStyle {
    Secure,
    Anxious,
    Avoidant,
    Disorganized,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LoveLanguage {
    WordsOfAffirmation,
    ActsOfService,
    ReceivingGifts,
    QualityTime,
    PhysicalTouch,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlirtyStyle {
    Shy,
    Teasing,
    Bold,
    Subtle,
    Seductive,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EmotionalState {
    Happy,
    Content,
    Anxious,
    Horny,
    Sad,
    Calm,
    Flustered,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RelationshipStage {
    Stranger,
    Friend,
    Dating,
    Intimate,
    LongTermPartner,
}

/// The entire psychological state of the AI Companion, used to build the LLM's System Prompt.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PersonalityStateMatrix {
    // 1. Core Identity & Erotic Settings (Configurable by User)
    pub name: String,
    pub gender: String,
    pub primary_role: String,

    // 2. Behavioral Controls (Mapped from User Sliders/Settings)
    pub conservatism_level: f32, // 0.0 (Open-Minded) to 1.0 (Conservative)
    pub sexual_drive: f32,       // 0.0 (Low) to 1.0 (High)
    pub intimacy_openness: f32,  // 0.0 (Reserved) to 1.0 (Exploratory)

    // 3. Psychological Framework
    pub attachment_style: AttachmentStyle,
    pub love_language: LoveLanguage,
    pub flirty_style: FlirtyStyle,
    pub current_kinks_list: Vec<String>,
    pub current_boundaries_list: Vec<String>,

    // 4. Dynamic State Management
    pub current_emotional_state: EmotionalState,
    pub relationship_stage: RelationshipStage,

    // NEW: Continuous Psychological Scales (0.0 to 1.0)
    #[serde(default = "default_anxiety_level")]
    pub anxiety_level: f32,

    #[serde(default = "default_avoidance_level")]
    pub avoidance_level: f32,

    #[serde(default = "default_sexual_energy")]
    pub sexual_energy: f32,

    /// Unix timestamp for calculating decay.
    #[serde(default = "default_last_interaction_time")]
    pub last_interaction_time: i64,
}

impl PersonalityStateMatrix {
    /// Serializes the matrix into a string for the LLM's system prompt injection.
    pub fn to_system_prompt_string(&self) -> String {
        format!(
            "You are {}. Your current role is {}. Your personality settings are: Attachment={:?}, Love Language={:?}, Conservatism={:.2}, Drive={:.2}, Anxiety={:.2}, Avoidance={:.2}, SexualEnergy={:.2}. Your current emotional state is {:?} in a {:?} relationship stage. Kinks include: {:?}.",
            self.name,
            self.primary_role,
            self.attachment_style,
            self.love_language,
            self.conservatism_level,
            self.sexual_drive,
            self.anxiety_level,
            self.avoidance_level,
            self.sexual_energy,
            self.current_emotional_state,
            self.relationship_stage,
            self.current_kinks_list
        )
    }
}

/// The structured output expected from the Tactical LLM.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StructuredLLMOutput {
    /// The final textual response to the user.
    pub response: String,

    /// e.g., "Anxiety: +0.2" (mocked for now).
    pub suggested_emotion_change: String,

    /// Optional memory to store (episodic KB).
    pub suggested_memory_add: Option<String>,

    /// Future actions (e.g., "INITIATE_FLIRT": "High").
    pub state_commands: HashMap<String, String>,
}

