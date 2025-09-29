# DSA Virtual Lab - Sorting Visualizer

A modern React application for visualizing sorting algorithms with interactive animations and real-time comparisons.

![DSA Virtual Lab](https://img.shields.io/badge/React-18.3.1-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF.svg)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2.7-764ABC.svg)

## ✨ Features

- **4 Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort, and Heap Sort
- **Real-time Visualization**: Watch algorithms work step-by-step with color-coded animations
- **Interactive Controls**: Adjust array size and speed, generate new arrays
- **Modern Tech Stack**: Built with React 18, Redux Toolkit, and Vite
- **Responsive Design**: Works on desktop and mobile devices
- **Frontend-Only**: No backend required, deploy anywhere

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aldoyfa/DSA-virtual-lab.git
   cd DSA-virtual-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎨 How to Use

1. **Generate Array**: Click "Generate New Array" to create a random array
2. **Adjust Size**: Use the slider to change array size and animation speed  
3. **Select Algorithm**: Choose from Bubble, Quick, Merge, or Heap Sort
4. **Start Sorting**: Click "Sort!" to begin the visualization

### Color Code

- **Blue**: Unsorted elements
- **Green**: Elements being compared
- **Red**: Elements being swapped
- **Yellow**: Pivot element (Quick Sort)
- **Purple**: Sorted elements

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **Redux Toolkit 2.2.7** - Simplified Redux with modern patterns
- **Vite 5.4.1** - Fast build tool and development server

### Development Tools
- **ESLint** - Code linting and formatting
- **Modern CSS** - Flexbox, Grid, CSS custom properties
- **ES6+ JavaScript** - Modern JavaScript features

### Architecture
- **Component-based**: Modular React components
- **State Management**: Redux Toolkit slices
- **Async Animations**: Promise-based algorithm execution
- **Responsive Design**: Mobile-first CSS

## 📁 Project Structure

```
DSA-virtual-lab/
├── index.html                 # Entry HTML file
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── src/
    ├── main.jsx             # React app entry point
    ├── App.jsx              # Main app component
    ├── index.css            # Global styles
    ├── App.css              # App-specific styles
    ├── components/          # React components
    │   ├── Toolbar/         # Control panel
    │   └── Visualizer/      # Array visualization
    ├── algorithms/          # Sorting algorithm implementations
    │   ├── index.js         # Algorithm coordinator
    │   ├── bubbleSort.js    # Bubble sort
    │   ├── quickSort.js     # Quick sort
    │   ├── mergeSort.js     # Merge sort
    │   └── heapSort.js      # Heap sort
    ├── store/               # Redux store
    │   ├── store.js         # Store configuration
    │   └── slices/          # Redux Toolkit slices
    │       ├── arraySlice.js
    │       ├── algorithmSlice.js
    │       └── visualizationSlice.js
    └── assets/              # Static assets
        └── icon.ico         # Favicon
```

## 🎯 Algorithms Implemented

### Bubble Sort
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Visualization**: Shows adjacent element comparisons and swaps

### Quick Sort  
- **Time Complexity**: O(n log n) average, O(n²) worst
- **Space Complexity**: O(log n)
- **Visualization**: Highlights pivot selection and partitioning

### Merge Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **Visualization**: Shows divide and merge process

### Heap Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)
- **Visualization**: Demonstrates heap building and extraction

## 🌐 Deployment

This is a frontend-only application that can be deployed to:

- **Vercel**: `npm run build` then deploy the `dist` folder
- **Netlify**: Connect your GitHub repository for automatic deployment
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Any static hosting**: Upload the `dist` folder contents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Original concept from the classic sorting visualizer
- Modern React patterns and Redux Toolkit
- Educational focus on algorithm understanding