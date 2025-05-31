from flask import Flask, request, jsonify
from tokenizer import BPETokenizer
from model import ChatbotModel

app = Flask(__name__)

# Load tokenizer and model
try:
    tokenizer = BPETokenizer.from_file('vocab.json', 'merges.txt')
    model = ChatbotModel.load('chatbot_model.npz')
except FileNotFoundError as e:
    print(f"Error loading model or tokenizer: {e}")
    print("Please ensure vocab.json, merges.txt, and chatbot_model.npz exist.")
    exit(1)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        # Tokenize input
        input_tokens = tokenizer.encode(data['message'])
        
        # Generate response
        response_tokens = model.generate(input_tokens)
        
        # Decode response
        response = tokenizer.decode(response_tokens)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'tokenizer_loaded': True
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 