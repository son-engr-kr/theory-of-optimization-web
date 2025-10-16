import './MainPage.css';

function MainPage({ onNavigate }) {
  return (
    <div className="main-page">
      <h1>Theory of Optimization</h1>
      <div className="links">
        <button onClick={() => onNavigate('theorem-2.28')}>
          Theorem 2.28: Convex Cone Mapping
        </button>
        <button onClick={() => onNavigate('lemma-2.70')}>
          Lemma 2.70: Local Lipschitz Continuity
        </button>
      </div>
    </div>
  );
}

export default MainPage;

