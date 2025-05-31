import os
from typing import List
from tokenizer import BPETokenizer
from model import ChatbotModel

def walk_monorepo(root_dir: str) -> List[str]:
    """Walk through the monorepo and collect file contents."""
    contents = []
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.py', '.ts', '.js', '.tsx', '.jsx', '.json', '.md')):
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        contents.append(f.read())
                except Exception as e:
                    print(f"Error reading {file}: {e}")
    return contents

def create_training_sequences(texts: List[str], tokenizer: BPETokenizer, 
                            max_length: int = 100) -> List[List[int]]:
    """Create training sequences from texts."""
    sequences = []
    for text in texts:
        tokens = tokenizer.encode(text)
        # Create overlapping sequences
        for i in range(0, len(tokens) - max_length + 1, max_length // 2):
            sequence = tokens[i:i + max_length]
            if len(sequence) == max_length:
                sequences.append(sequence)
    return sequences

def main():
    # Initialize tokenizer
    try:
        tokenizer = BPETokenizer.from_file('vocab.json', 'merges.txt')
    except FileNotFoundError:
        print("Error: vocab.json and merges.txt not found.")
        print("Please ensure these files exist in the current directory.")
        return

    # Walk through monorepo
    print("Walking through monorepo...")
    texts = walk_monorepo('../../')
    print(f"Found {len(texts)} files")

    # Create training sequences
    print("Creating training sequences...")
    sequences = create_training_sequences(texts, tokenizer)
    print(f"Created {len(sequences)} training sequences")

    # Initialize and train model
    print("Initializing model...")
    model = ChatbotModel(
        vocab_size=len(tokenizer.vocab),
        hidden_size=256,
        num_layers=1
    )

    print("Training model...")
    model.train(sequences, epochs=5, lr=0.001)

    # Save model
    print("Saving model...")
    model.save('chatbot_model.npz')
    print("Training complete!")

if __name__ == '__main__':
    main() 