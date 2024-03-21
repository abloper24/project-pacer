import closeIcon from "../../assets/images/icons/close-24px.svg";
import "./DeleteModal.scss";

const DeleteModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="modal__container">
      <div className="modal__content">
        <button onClick={onClose} className="modal__close-btn">
          <img src={closeIcon} alt="close icon" />
        </button>
        <h2 className='modal__title'>Delete  warehouse?</h2>
        <p className='modal__description'>
          Please confirm that you'd like to delete the  from the list of warehouses.
          You won't be able to undo this action.
        </p>
        <div className="modal__btn-container">
          <button onClick={onClose} className="modal__cancel-btn">Cancel</button>
          <button onClick={onDelete} className="modal__delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;