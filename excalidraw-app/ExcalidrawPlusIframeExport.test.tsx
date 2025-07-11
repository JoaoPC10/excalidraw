import { parseSceneData } from "./ExcalidrawPlusIframeExport";
import { ExcalidrawError } from "@excalidraw/excalidraw/errors";


jest.mock("./data/LocalData", () => ({
  LocalData: {
    fileStorage: {
      getFiles: jest.fn(),
    },
  },
}));

import { LocalData } from "./data/LocalData";

describe("parseSceneData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validElements = JSON.stringify([
    { id: "1", type: "rectangle", fileId: "file-123" },
  ]);

  const validAppState = JSON.stringify({
    viewBackgroundColor: "#ffffff",
  });

  test("Deve lançar erro se rawElementsString for null", async () => {
    await expect(
      parseSceneData({ rawElementsString: null, rawAppStateString: validAppState })
    ).rejects.toThrow("Elements or appstate is missing.");
  });

  test("Deve lançar erro se rawAppStateString for null", async () => {
    await expect(
      parseSceneData({ rawElementsString: validElements, rawAppStateString: null })
    ).rejects.toThrow("Elements or appstate is missing.");
  });

  test("Deve lançar erro se elements for vazio", async () => {
    const emptyElements = JSON.stringify([]);

    await expect(
      parseSceneData({
        rawElementsString: emptyElements,
        rawAppStateString: validAppState,
      })
    ).rejects.toThrow("Scene is empty, nothing to export.");
  });

  test("Deve relançar erro ExcalidrawError original", async () => {
    const invalidJSON = "not-json";

    await expect(
      parseSceneData({
        rawElementsString: invalidJSON,
        rawAppStateString: validAppState,
      })
    ).rejects.toThrow(ExcalidrawError);
  });

 });
