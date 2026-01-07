use anyhow::Result;
use ed25519_dalek::{Signature, Signer, SigningKey, Verifier, VerifyingKey};
use rand_core::{OsRng, RngCore};
use sha2::{Digest, Sha256};
use tracing::info;

/// Generates a new Ed25519 signing key (verifying key can be derived).
pub fn generate_signing_key() -> SigningKey {
    // `ed25519-dalek` v2 does not always expose `SigningKey::generate()` without extra features.
    // Generate securely using OS randomness and build the signing key from raw bytes.
    let mut sk_bytes = [0u8; 32];
    OsRng.fill_bytes(&mut sk_bytes);
    let signing_key = SigningKey::from_bytes(&sk_bytes);
    info!("crypto_generated_ed25519_signing_key");
    signing_key
}

/// Signs a message using the agent's private key.
pub fn sign_message(signing_key: &SigningKey, message: &[u8]) -> Signature {
    signing_key.sign(message)
}

/// Verifies a signature using the agent's public key.
pub fn verify_signature(verifying_key: &VerifyingKey, message: &[u8], signature: &Signature) -> Result<()> {
    verifying_key
        .verify(message, signature)
        .map_err(|e| anyhow::anyhow!("CRYPTO: Signature verification failed: {e}"))?;
    Ok(())
}

/// Generates a SHA-256 hash for data integrity verification.
pub fn hash_data(data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hasher.finalize().to_vec()
}

