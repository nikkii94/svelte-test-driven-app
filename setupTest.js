import '@testing-library/jest-dom/extend-expect';
import { reset } from './src/locale/i18n';

afterEach(() => {
    reset();
});