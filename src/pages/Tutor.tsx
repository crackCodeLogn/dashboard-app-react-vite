import TutorSessionGenerator from "../components/tutor/TutorSessionGenerator.tsx";
import TutorSessionSaveData from "../components/tutor/TutorSessionSaveData.tsx";
import TutorSessionGetLatestData from "../components/tutor/TutorSessionGetLatestData.tsx";


const Tutor = () => {
  return (
    <div>
      <h1> Tutor Dashboard </h1>
      <hr/>
      <div className={'vflex'}>
        <div className={'linear'}>
          <TutorSessionGenerator/>
        </div>
        <div className={'linear'}>
          <TutorSessionSaveData/>
          <TutorSessionGetLatestData/>
        </div>
      </div>
    </div>
  );
};

export default Tutor;