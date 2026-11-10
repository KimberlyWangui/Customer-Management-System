function App() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-primary text-white px-4 py-3">
        <h1 className="text-xl font-bold">MtejaHub</h1>
      </nav>

      <main className="p-4 md:p-8">
        <h2 className="text-2xl md:text-4xl font-bold text-primary-dark">
          Tailwind is working
        </h2>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-primary-light rounded-lg p-4">Box 1</div>
          <div className="flex-1 bg-primary-light rounded-lg p-4">Box 2</div>
          <div className="flex-1 bg-primary-light rounded-lg p-4">Box 3</div>
        </div>

        <button className="mt-6 w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg">
          Test button
        </button>
      </main>
    </div>
  )
}

export default App