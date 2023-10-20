import Loader from "./Loader";

const FullPageLoader: React.FC = () => (
  <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-stone-200 bg-opacity-20">
    <Loader />
  </div>
);

export default FullPageLoader;
