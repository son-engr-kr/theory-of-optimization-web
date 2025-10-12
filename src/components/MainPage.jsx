import './MainPage.css';

function MainPage({ onNavigate }) {
  return (
    <div className="main-page">
      <h1>Theory of Optimization</h1>
      <div className="links">
        <button onClick={() => onNavigate('theorem-2.28')}>
          Theorem 2.28: Convex Cone Mapping
        </button>
      </div>
    </div>
  );
}

export default MainPage;

