#!/bin/bash
# Tunnel Cloudflare pour l'API Pokevendre Pro
# Relance automatiquement et met à jour l'URL dans quiz.astro

set -e

QUIZ_FILE="/home/ubuntu/flipmaster-lp/src/pages/quiz.astro"
TUNNEL_LOG="/tmp/cloudflare-tunnel.log"

echo "[$(date)] Démarrage du tunnel Cloudflare..."

# Lancer le tunnel en arrière-plan et capturer l'URL
cloudflared tunnel --url http://127.0.0.1:5000 > "$TUNNEL_LOG" 2>&1 &
TUNNEL_PID=$!

echo "[$(date)] Tunnel PID: $TUNNEL_PID"

# Attendre que l'URL apparaisse dans les logs
URL=""
for i in $(seq 1 30); do
    sleep 1
    URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' "$TUNNEL_LOG" 2>/dev/null | head -1)
    if [ -n "$URL" ]; then
        break
    fi
done

if [ -z "$URL" ]; then
    echo "[$(date)] ERREUR: Impossible d'obtenir l'URL du tunnel"
    cat "$TUNNEL_LOG"
    exit 1
fi

echo "[$(date)] Tunnel URL: $URL"
echo "[$(date)] API URL: ${URL}/capture"

# Mettre à jour quiz.astro avec la nouvelle URL
if grep -q "trycloudflare.com" "$QUIZ_FILE"; then
    OLD_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' "$QUIZ_FILE" | head -1)
    if [ -n "$OLD_URL" ]; then
        sed -i "s|${OLD_URL}|${URL}|g" "$QUIZ_FILE"
        echo "[$(date)] URL mise à jour: ${OLD_URL} → ${URL}"
    fi
else
    echo "[$(date)] ATTENTION: Pas d'URL trycloudflare trouvée dans quiz.astro"
fi

# Rebuilder et déployer
cd /home/ubuntu/flipmaster-lp
npm run build 2>&1 | tail -5

# Déployer sur Netlify
NETLIFY_TOKEN=$(cat ~/.netlify/config.json | grep -oP '"token"\s*:\s*"\K[^"]+')
SITE_ID="caad77e6-7103-41a9-a3dc-cddb44725c9e"
tar -czf /tmp/deploy.tar.gz -C dist . 
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
     -H "Content-Type: application/zip" \
     --data-binary @/tmp/deploy.tar.gz \
     "https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys" | grep -oP '"state"\s*:\s*"\K[^"]+' || echo "deployed"

echo "[$(date)] Déploiement terminé!"
echo "[$(date)] Tunnel actif. CTRL+C pour arrêter."

# Garder le tunnel en vie
wait $TUNNEL_PID