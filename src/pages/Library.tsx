import LibraryReturnComponent from "../components/library/LibraryReturnComponent.tsx";
import LibraryBorrowAndExpectedReturnComponent from "../components/library/LibraryBorrowAndExpectedReturnComponent.tsx";
import {useEffect} from "react";

const Library = () => {
  useEffect(() => {
    document.title = 'V2K Library';
  }, []);

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