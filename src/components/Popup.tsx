interface IPopup {
  popUpInfo: string;
  children?: React.ReactNode;
}
export const Popup = ({ popUpInfo, children }: IPopup) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center py-10">
        <p className="text-lg font-semibold">{popUpInfo}</p>
        {children}
      </div>
    </div>
  );
};
