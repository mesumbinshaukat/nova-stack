import json
import re
from typing import List, Dict, Tuple

class BPETokenizer:
    def __init__(self, vocab: Dict[str, int], merges: List[Tuple[str, str]]):
        self.vocab = vocab
        self.merges = merges
        self.pattern = re.compile(r'\S+|\s+')

    @classmethod
    def from_file(cls, vocab_path: str, merges_path: str) -> 'BPETokenizer':
        with open(vocab_path, 'r', encoding='utf-8') as f:
            vocab = json.load(f)
        with open(merges_path, 'r', encoding='utf-8') as f:
            merges = [tuple(line.strip().split()) for line in f if line.strip()]
        return cls(vocab, merges)

    def encode(self, text: str) -> List[int]:
        # Simple tokenization: split on whitespace and non-whitespace
        tokens = self.pattern.findall(text)
        # Convert tokens to IDs (fallback to unknown token if not in vocab)
        return [self.vocab.get(token, self.vocab.get('<unk>', 0)) for token in tokens]

    def decode(self, tokens: List[int]) -> str:
        # Convert IDs back to tokens
        id_to_token = {v: k for k, v in self.vocab.items()}
        return ''.join(id_to_token.get(token, '<unk>') for token in tokens) 