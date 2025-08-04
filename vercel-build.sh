#!/bin/bash

# Build the application
npm run build

# Seed the database with production data
echo "Seeding production database..."
npm run db:seed:prod

echo "Build and seeding completed successfully!" 