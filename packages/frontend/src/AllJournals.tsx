import type { IApiJournalData } from "csc437-monorepo-backend/src/common/IApiData";
import View from "./components/View";
import Write from "./components/Write";

enum JournalComponent {
  WRITE = "write",
  VIEW = "view",
}

interface AllJournalsProps {
  journals: IApiJournalData[];
  isLoading: boolean;
  hasError: boolean;
  authToken: string;
  component: JournalComponent;
}

export function AllJournals({
  journals,
  isLoading,
  hasError,
  authToken,
  component,
}: AllJournalsProps) {
  if (isLoading) {
    return (
      <>
        <h2>Loading journals...</h2>
      </>
    );
  }

  if (hasError) {
    return (
      <>
        <h2>All Journals</h2>
        <div style={{ color: "red" }}>
          Error loading journals. Please try again later.
        </div>
      </>
    );
  }

  return (
    <>
      {component === JournalComponent.VIEW ? (
        <View journals={journals} />
      ) : (
        <Write journals={journals} authToken={authToken || ""} />
      )}
    </>
  );
}
