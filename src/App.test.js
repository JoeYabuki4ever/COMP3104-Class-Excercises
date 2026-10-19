import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('shows the student system, student identity and an empty list', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Student Information System' })).toBeInTheDocument();
  expect(screen.getByText(/101418321.*Taharim Haque/)).toBeInTheDocument();
  expect(screen.getByText('No students added yet')).toBeInTheDocument();
});

test('adds a complete student record and clears the form', () => {
  const { container } = render(<App />);
  const name = container.querySelector('input[name="name"]');
  const age = container.querySelector('input[name="age"]');
  const major = container.querySelector('input[name="major"]');

  fireEvent.change(name, { target: { value: 'Alex Student' } });
  fireEvent.change(age, { target: { value: '21' } });
  fireEvent.change(major, { target: { value: 'Computer Programming' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add Student' }));

  expect(screen.getByRole('heading', { name: 'Alex Student' })).toBeInTheDocument();
  expect(screen.getByText('Age: 21')).toBeInTheDocument();
  expect(screen.getByText('Major: Computer Programming')).toBeInTheDocument();
  expect(screen.queryByText('No students added yet')).not.toBeInTheDocument();
  expect(name).toHaveValue('');
  expect(age).toHaveValue(null);
  expect(major).toHaveValue('');
});

test('does not add an incomplete student record', () => {
  const { container } = render(<App />);
  fireEvent.change(container.querySelector('input[name="name"]'), {
    target: { value: 'Incomplete Student' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Add Student' }));

  expect(screen.getByText('No students added yet')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Incomplete Student' })).not.toBeInTheDocument();
});
