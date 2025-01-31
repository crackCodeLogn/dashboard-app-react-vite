import LibraryReturnComponent from "../components/library/LibraryReturnComponent.tsx";
import LibraryBorrowAndExpectedReturnComponent from "../components/library/LibraryBorrowAndExpectedReturnComponent.tsx";

const Library = () => {

  return (
    <div>
      <h1>Library Dashboard</h1>
      <hr/>
      <div className={'linear'}>
        <LibraryBorrowAndExpectedReturnComponent/>
        <LibraryReturnComponent/>
      </div>
    </div>
  );
};

export default Library;