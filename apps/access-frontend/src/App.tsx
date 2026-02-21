import { Button, Heading, Text } from '@vibe/core';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-20">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center flex flex-col items-center gap-4">
        <Heading type={Heading.types.H1} color={TypographyColor.PRIMARY}>
          Access Request System
        </Heading>
        <Text type={Text.types.TEXT1} color={TypographyColor.SECONDARY}>
          Vibe Design System is now integrated!
        </Text>
        <Button onClick={() => alert('Vibe is working!')} kind="primary">
          Click Me
        </Button>
      </div>
    </div>
  );
}

export default App;
