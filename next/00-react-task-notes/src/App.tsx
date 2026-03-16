import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Task Notes</h1>
      </header>
      <main className="main">
        <TaskList />
      </main>
    </div>
  );
}

export default App;
