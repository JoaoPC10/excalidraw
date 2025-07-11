import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import type { Theme } from "@excalidraw/element/types";

// Mocks no topo do arquivo, antes dos imports que usam essas libs

vi.mock("@excalidraw/common", async () => {
  const actual = await vi.importActual<typeof import("@excalidraw/common")>(
    "@excalidraw/common"
  );
  return {
    ...actual,               // mantém todas as exportações originais, inclusive MIME_TYPES
    isDevEnv: () => false,   // mocka isDevEnv como false para simplificar o teste
  };
});

vi.mock("@excalidraw/excalidraw", async () => {
  const actual = await vi.importActual<typeof import("@excalidraw/excalidraw")>(
    "@excalidraw/excalidraw"
  );

  // Mock do MainMenu e suas propriedades estáticas usadas no componente
  const MainMenuMock = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-main-menu">
      <input type="search" placeholder="Search here" />
      {children}
    </div>
  );

  MainMenuMock.DefaultItems = {
    LoadScene: () => <div>LoadScene</div>,
    SaveToActiveFile: () => <div>SaveToActiveFile</div>,
    Export: () => <div>Export</div>,
    SaveAsImage: () => <div>SaveAsImage</div>,
    LiveCollaborationTrigger: () => <div>LiveCollaborationTrigger</div>,
    CommandPalette: () => <div>CommandPalette</div>,
    SearchMenu: () => <div>SearchMenu</div>,
    Help: () => <div>Help</div>,
    ClearCanvas: () => <div>ClearCanvas</div>,
    Socials: () => <div>Socials</div>,
    ToggleTheme: () => <div>ToggleTheme</div>,
    ChangeCanvasBackground: () => <div>ChangeCanvasBackground</div>,
  };
  MainMenuMock.Separator = () => <hr />;
  MainMenuMock.ItemLink = ({ children }: { children: React.ReactNode }) => <a>{children}</a>;
  MainMenuMock.Item = ({ children }: { children: React.ReactNode }) => <button>{children}</button>;
  MainMenuMock.ItemCustom = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  return {
    ...actual,    // mantém todas as outras exportações originais, como 'languages'
    MainMenu: MainMenuMock,
  };
});

// Mock do componente LanguageList local
vi.mock("../app-language/LanguageList", () => ({
  LanguageList: (props: any) => <div data-testid="mock-language-list" {...props} />,
}));

// Mock da constante isExcalidrawPlusSignedUser
vi.mock("../app_constants", () => ({
  isExcalidrawPlusSignedUser: false,
}));

// Mock da função saveDebugState
vi.mock("./DebugCanvas", () => ({
  saveDebugState: vi.fn(),
}));

// Agora importe o componente APÓS definir os mocks
import { AppMainMenu } from "../components/AppMainMenu";

const theme: Theme = "light";

const propsMock = {
  onCollabDialogOpen: vi.fn(),
  isCollaborating: false,
  isCollabEnabled: true,
  theme,
  setTheme: vi.fn(),
  refresh: vi.fn(),
};

describe("AppMainMenu", () => {
  it("tentar usar a ação Ctrl+F", () => {
    render(<AppMainMenu {...propsMock} />);

    const input = document.querySelector('input[type="search"]')!;
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveFocus();

    fireEvent.keyDown(window, { key: "f", ctrlKey: true });

    expect(input).toHaveFocus();
  });
});
