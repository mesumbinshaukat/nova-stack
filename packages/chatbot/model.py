import numpy as np
from typing import List

class ChatbotModel:
    def __init__(self, vocab_size: int, hidden_size: int, num_layers: int = 1):
        self.vocab_size = vocab_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        # Initialize weights
        self.W1 = np.random.randn(vocab_size, hidden_size) * 0.01
        self.W2 = np.random.randn(hidden_size, vocab_size) * 0.01

    def train(self, token_sequences: List[List[int]], epochs: int = 1, lr: float = 0.001):
        for epoch in range(epochs):
            for seq in token_sequences:
                # Convert input tokens to one-hot vectors
                x = np.eye(self.vocab_size)[seq[:-1]]  # shape: (seq_len-1, vocab_size)
                # Forward pass
                hidden = x.dot(self.W1)                # shape: (seq_len-1, hidden_size)
                logits = hidden.dot(self.W2)           # shape: (seq_len-1, vocab_size)
                # Placeholder for backprop updates
                # In a real implementation, we would:
                # 1. Compute loss (e.g., cross-entropy)
                # 2. Compute gradients
                # 3. Update weights
            print(f"Epoch {epoch + 1}/{epochs} complete")
        print("Training finished.")

    def generate(self, input_tokens: List[int], max_length: int = 50) -> List[int]:
        generated = []
        x = np.eye(self.vocab_size)[input_tokens]  # one-hot for input
        hidden = x.dot(self.W1)
        
        for _ in range(max_length):
            # Take last token's hidden state
            last_hidden = hidden[-1:]  # shape: (1, hidden_size)
            # Compute logits for next token
            logits = last_hidden.dot(self.W2)  # shape: (1, vocab_size)
            # Pick highest probability token
            next_token = int(np.argmax(logits, axis=-1)[0])
            generated.append(next_token)
            
            # Append next token to hidden states
            new_one_hot = np.zeros((1, self.vocab_size))
            new_one_hot[0, next_token] = 1
            new_hidden = new_one_hot.dot(self.W1)
            hidden = np.vstack([hidden, new_hidden])
            
            # Stop if we generate an EOS token (assuming 1 is EOS)
            if next_token == 1:
                break
                
        return generated

    def save(self, filepath: str):
        np.savez_compressed(filepath, W1=self.W1, W2=self.W2)

    @classmethod
    def load(cls, filepath: str) -> 'ChatbotModel':
        data = np.load(filepath)
        model = cls(vocab_size=data['W1'].shape[0], hidden_size=data['W1'].shape[1])
        model.W1 = data['W1']
        model.W2 = data['W2']
        return model 