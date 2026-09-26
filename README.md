# 🧠 DocuBrain IA — Agent RAG & Analyse de PDF

Un assistant IA full-stack qui permet de discuter avec vos documents PDF grâce à la technologie RAG (Retrieval-Augmented Generation).

## 🚀 Technologies

- **Next.js 14** (App Router, TypeScript)
- **Google Gemini API** (IA générative + Embeddings)
- **Supabase** (PostgreSQL + pgvector pour la recherche vectorielle)
- **Tailwind CSS** (Design moderne et responsive)
- **Framer Motion** (Animations fluides)

## 📸 Captures d'écran

### Interface principale
> Une interface de chat moderne avec sidebar, espace de discussion récente et zone de glisser-déposer.

### Authentification
> Page de connexion sécurisée avec nom complet et email.

## 🛠️ Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/docubrain-ia.git
cd docubrain-ia
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env.local` avec vos clés API :
```env
NEXT_PUBLIC_GEMINI_API_KEY=votre_cle_gemini
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
```

4. Lancez le serveur :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📝 Fonctionnalités

- ✅ Upload de PDF avec glisser-déposer
- ✅ Extraction automatique du texte du PDF
- ✅ Recherche sémantique (RAG) via embeddings et pgvector
- ✅ Chat IA avec citations de pages
- ✅ Interface authentifiée (email + nom)
- ✅ Historique des discussions récentes
- ✅ Design moderne et responsive

## 📁 Structure du projet

```
src/
├── app/
│   ├── page.tsx          # Interface principale (Chat)
│   ├── layout.tsx        # Layout global
│   ├── globals.css       # Styles Tailwind
│   └── api/
│       ├── chat/route.ts # API pour les conversations
│       └── upload/route.ts # API pour l'upload PDF
├── lib/
│   ├── ai.ts            # Logique IA (Gemini, embeddings)
│   └── supabase.ts      # Client Supabase
```

## 🤝 Contributeurs

- **Momar DIOP** — [Portfolio](https://linkedin.com/in/votre-profil)

## 📄 License

MIT License
