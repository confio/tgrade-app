// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

// Fix for "ReferenceError: TextEncoder is not defined": https://github.com/facebook/jest/issues/9983#issuecomment-696427273
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Fix for antd v4: https://github.com/ant-design/ant-design/issues/21096#issuecomment-725301551
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
