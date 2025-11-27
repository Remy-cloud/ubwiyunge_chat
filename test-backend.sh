#!/bin/bash

# Ubwiyunge Backend Test Script
# Simple validation for school project

echo "🧪 Testing Ubwiyunge Backend Integration"
echo "======================================="

BASE_URL="http://localhost:3000"

echo "1. Testing Stats Endpoint..."
response=$(curl -s ${BASE_URL}/api/stats)
if [[ $response == *"success"* ]]; then
    echo "   ✅ Stats API working"
else
    echo "   ❌ Stats API failed"
fi

echo "2. Testing Issues Endpoint..."
response=$(curl -s ${BASE_URL}/api/issues)
if [[ $response == *"success"* ]]; then
    echo "   ✅ Issues API working"
else
    echo "   ❌ Issues API failed"
fi

echo "3. Testing Leaders Endpoint..."
response=$(curl -s ${BASE_URL}/api/leaders)
if [[ $response == *"success"* ]]; then
    echo "   ✅ Leaders API working"
else
    echo "   ❌ Leaders API failed"
fi

echo "4. Testing Issue Creation..."
response=$(curl -s -X POST ${BASE_URL}/api/issues \
  -F "title=Backend Test Issue" \
  -F "description=Testing issue creation via API" \
  -F "category=testing" \
  -F "location=Test Location")
if [[ $response == *"success"* ]]; then
    echo "   ✅ Issue creation working"
else
    echo "   ❌ Issue creation failed"
fi

echo ""
echo "🎯 Backend Integration Test Complete!"
echo "Frontend available at: ${BASE_URL}"
echo "API docs: See BACKEND.md"
