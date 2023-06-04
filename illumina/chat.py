import random
import json
from model import NeuralNet
import torch
from nltk_utils import bag_of_words, tokenize

device = 'cpu'

with open('queries.json', 'r') as json_data:
    queries = json.load(json_data)

data = torch.load('data.pth')
all_words = data['all_words']
model_state = data["model_state"]

model = NeuralNet(data["input_size"], data["hidden_size"], data["output_size"]).to(device)
model.load_state_dict(model_state)
model.eval()

tags = data['tags']
print("Let's chat! (type 'quit' to exit)")

def get_response(msg):
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for query in queries['queries']:
            if tag == query["tag"]:
                return random.choice(query['responses'])
    
    return "I do not understand..."

    