# Stonify5 Frontend

Real-time multiplayer Gomoku game with elegant design

## Development

```bash
cd public
python3 -m http.server 3000
```

## Deployment

```bash
docker build -t stonify5-frontend .
docker run -d -p 80:80 stonify5-frontend
```
