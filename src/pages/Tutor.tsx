import TutorSessionGeneratorComponent from "../components/tutor/TutorSessionGeneratorComponent.tsx";
import TutorSessionSaveDataComponent from "../components/tutor/TutorSessionSaveDataComponent.tsx";
import TutorSessionGetLatestDataComponent from "../components/tutor/TutorSessionGetLatestDataComponent.tsx";


const Tutor = () => {
  return (
    <div>
      <h1> Tutor Dashboard </h1>
      <hr/>
      <div className={'vflex'}>
        <div className={'linear'}>
          <TutorSessionGeneratorComponent/>
        </div>
        <div className={'linear'}>
          <TutorSessionSaveDataComponent/>
          <TutorSessionGetLatestDataComponent/>
        </div>
      </div>
    </div>
  );
};

export default Tutor;