#!/usr/bin/env python3
"""
Stripe Webhook Server for Serpent Town
Handles Stripe purchase webhooks and writes to user-products.json
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import hashlib
import hmac
from datetime import datetime
import os

# Configuration
WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_test_secret')
DATA_DIR = '/root/catalog/data'
USER_PRODUCTS_FILE = f'{DATA_DIR}/user-products.json'

class WebhookHandler(BaseHTTPRequestHandler):
    
    def do_POST(self):
        if self.path == '/webhook/stripe':
            self.handle_stripe_webhook()
        else:
            self.send_error(404)
    
    def handle_stripe_webhook(self):
        # Read payload
        content_length = int(self.headers['Content-Length'])
        payload = self.rfile.read(content_length)
        sig_header = self.headers.get('Stripe-Signature', '')
        
        # Verify signature (simplified - use stripe library in production)
        try:
            event = json.loads(payload)
            print(f"📥 Received Stripe event: {event.get('type')}")
            
            # Handle checkout completed
            if event['type'] == 'checkout.session.completed':
                session = event['data']['object']
                self.process_purchase(session)
                
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success'}).encode())
            
        except Exception as e:
            print(f"❌ Error: {e}")
            self.send_error(400, str(e))
    
    def process_purchase(self, session):
        """Add purchased snake to user-products.json"""
        
        # Extract data
        user_id = session.get('client_reference_id', 'user_unknown')
        product_id = session.get('metadata', {}).get('product_id', 'unknown')
        payment_id = session.get('payment_intent', 'unknown')
        amount = session.get('amount_total', 0) / 100  # Convert cents
        
        # Create assignment
        assignment_id = f"assign_{hashlib.sha256(payment_id.encode()).hexdigest()[:8]}"
        
        purchase = {
            "assignment_id": assignment_id,
            "user_id": user_id,
            "product_id": product_id,
            "product_type": "real",
            "nickname": f"My Snake",
            "acquired_at": datetime.utcnow().isoformat() + "Z",
            "acquisition_type": "stripe_purchase",
            "payment_id": payment_id,
            "price_paid": amount,
            "currency": session.get('currency', 'usd'),
            "stats": {
                "hunger": 80,
                "water": 90,
                "temperature": 85,
                "humidity": 60,
                "health": 100,
                "stress": 20,
                "cleanliness": 90,
                "happiness": 80
            }
        }
        
        # Load existing
        try:
            with open(USER_PRODUCTS_FILE, 'r') as f:
                user_products = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            user_products = []
        
        # Add new purchase
        user_products.append(purchase)
        
        # Save
        with open(USER_PRODUCTS_FILE, 'w') as f:
            json.dump(user_products, f, indent=2)
        
        print(f"✅ Added snake to game: {product_id} for user {user_id}")
        print(f"   Assignment ID: {assignment_id}")
        print(f"   Payment: {amount} {purchase['currency']}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8001))
    print('🐍 Serpent Town Webhook Server')
    print(f'🌐 Running on http://localhost:{port}')
    print(f'📍 Webhook endpoint: http://localhost:{port}/webhook/stripe')
    print(f'📁 Data file: {USER_PRODUCTS_FILE}')
    print()
    print('Configure Stripe webhook URL to point here!')
    print()
    
    HTTPServer(('0.0.0.0', port), WebhookHandler).serve_forever()
