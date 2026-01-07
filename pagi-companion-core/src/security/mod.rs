pub mod cryptography;

use anyhow::Result;
use ed25519_dalek::{SigningKey, VerifyingKey};
use serde::{Deserialize, Serialize};

/// Defines the secure identity of the Agent.
///
/// NOTE: This stores raw key bytes for bare-metal persistence (dev/research).
/// For production, consider OS key stores / TPM / HSM.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AgentIdentity {
    /// Unique identifier for the agent (for now caller-provided).
    pub agent_id: String,

    /// Ed25519 private signing key bytes.
    #[serde(with = "serde_bytes")]
    pub private_key_bytes: Vec<u8>,

    /// Ed25519 public verifying key bytes.
    #[serde(with = "serde_bytes")]
    pub public_key_bytes: Vec<u8>,
}

impl AgentIdentity {
    /// Creates a new identity by generating a fresh keypair.
    pub fn new_with_generation(agent_id: String) -> Self {
        let signing_key = cryptography::generate_signing_key();
        let verifying_key = signing_key.verifying_key();

        AgentIdentity {
            agent_id,
            private_key_bytes: signing_key.to_bytes().to_vec(),
            public_key_bytes: verifying_key.to_bytes().to_vec(),
        }
    }

    /// Reconstructs a `SigningKey` from persisted bytes.
    pub fn signing_key(&self) -> Result<SigningKey> {
        let b: [u8; 32] = self
            .private_key_bytes
            .as_slice()
            .try_into()
            .map_err(|_| anyhow::anyhow!("Invalid private key length"))?;
        Ok(SigningKey::from_bytes(&b))
    }

    /// Reconstructs a `VerifyingKey` from persisted bytes.
    pub fn verifying_key(&self) -> Result<VerifyingKey> {
        let b: [u8; 32] = self
            .public_key_bytes
            .as_slice()
            .try_into()
            .map_err(|_| anyhow::anyhow!("Invalid public key length"))?;
        Ok(VerifyingKey::from_bytes(&b)?)
    }
}

