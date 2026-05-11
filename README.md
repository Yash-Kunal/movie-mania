# 🎬 MovieMania – A Movie Discovery Web App

MovieMania is a sleek and interactive web app that lets users browse, search, and explore movies using the **OMDb API**. Users can view detailed information about movies, including cast, crew, and IMDb ratings, while also saving their favourites for easy access.  

---

## ✨ Features
- 🔍 Browse and search for popular movies  
- 🖼️ Clean grid layout showing posters, title & release year  
- 🎬 Click a movie card to open a **detailed info page** including:  
  - Overview & release info  
  - IMDb rating  
  - Cast, director, and writers  
- ❤️ Add/remove movies to your Favourites  
- 🔄 **Infinite Scrolling** to load more movies as you scroll  
- 🌈 Stylish background gradients and responsive UI  
- 💨 Fast SPA experience using React Router & Context API  
- 🔍 Advanced filters for genre, year range, and rating000000000

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite 6, Framer Motion
- **State Management:** React Context API  
- **API:** [OMDb API](https://www.omdbapi.com/)  
- **Build & Deployment:** Vite, Vercel  

---

## 📸 Screenshots  

### 🏠 Home Page  
![Home Page](src/assets/home.png)  

### 🎬 Movie Detail Page  
![Movie Detail](src/assets/details.png)  

### ❤️ Favourites Page  
![Favourites](src/assets/favs.png)  

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Yash-Kunal/movie-mania.git
cd movie-mania
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables
Create a `.env` file in the root directory and add:
```
VITE_OMDB_API_KEY=your_api_key_here
```

### 4️⃣ Run in development mode
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🚀 Deployment on Vercel

### Method 1: Deploy from the Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign up or log in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add environment variables:
   - Name: `VITE_OMDB_API_KEY`
   - Value: Your OMDb API key
6. Click "Deploy"

### Method 2: Deploy with Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to link to your Vercel account and set up the project
5. When asked about environment variables, add:
   - Name: `VITE_OMDB_API_KEY`
   - Value: Your OMDb API key

### Important Notes

- The `vercel.json` file in the repository contains the necessary SPA routing configuration
- The app is set up to handle API failures gracefully with offline mock data
- Vercel will automatically rebuild and redeploy when you push changes to your repository
