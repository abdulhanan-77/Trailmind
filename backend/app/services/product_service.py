import json
import faiss # type: ignore
import numpy as np
import os

# For embeddings, we can use a simple sentence transformer or OpenRouter embedding API
# For MVP/Offline speed without API costs, let's use a dummy embedding or simple one
# if user wants "embeddings on the go", we might simulate or use a lightweight lib

class ProductService:
    def __init__(self):
        self.products = []
        self.index = None
        self.load_products()
        self.build_index()

    def load_products(self):
        path = os.path.join(os.path.dirname(__file__), "../data/products.json")
        try:
            with open(path, 'r') as f:
                self.products = json.load(f)
        except Exception as e:
            print(f"Error loading products: {e}")
            self.products = []

    def _get_embedding(self, text: str):
        # TODO: Replace with real embedding (OpenAI/Cohere/Local)
        # Mock 128-dim vector
        return np.random.rand(128).astype('float32')

    def build_index(self):
        if not self.products:
            return
        
        # Dimension 128 for mock
        self.index = faiss.IndexFlatL2(128)
        embeddings = []
        for p in self.products:
            # Embed combined text
            text = f"{p['name']} {p['category']} {p['description']}"
            emb = self._get_embedding(text)
            embeddings.append(emb)
        
        if embeddings:
            self.index.add(np.array(embeddings))

    def search(self, query: str, k: int = 3):
        if not self.index:
            return []
        
        query_emb = self._get_embedding(query).reshape(1, -1)
        distances, indices = self.index.search(query_emb, k)
        
        results = []
        for i in indices[0]:
            if i < len(self.products):
                results.append(self.products[i])
        return results

product_service = ProductService()
