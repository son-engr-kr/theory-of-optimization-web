import { Link } from 'react-router-dom'
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-page">
      <h1>Theory of Optimization</h1>
      <div className="links">
        <Link to="/theorem-2.28">
          <button>
            Theorem 2.28: Convex Cone Mapping
          </button>
        </Link>
        <Link to="/lemma-2.70">
          <button>
            Lemma 2.70: Local Lipschitz Continuity
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;

