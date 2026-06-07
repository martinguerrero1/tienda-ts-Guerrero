type ErrorMessageProps = {
  mensaje: string;
};

function ErrorMessage({ mensaje }: ErrorMessageProps) {
  return (
    <div className="flex min-h-75 items-center justify-center">
      <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-center">
        <h2 className="mb-2 text-lg font-semibold text-red-700">
          Ocurrió un error
        </h2>

        <p className="text-red-600">{mensaje}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
