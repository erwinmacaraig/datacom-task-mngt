import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({ref, handleDeleteDecisionClick}){
    return (
        <dialog id="deleteDialog" ref={ref}>
            <form method="dialog">
                <p>Are you sure you want to delete this task?</p>
                <div className="btn-action">
                    <button value="yes" onClick={(e) => {
                        handleDeleteDecisionClick(e.target.value)
                    }}>Yes</button> 
                    <button value="close" onClick={(e) => {
                        handleDeleteDecisionClick(e.target.value)
                    }}>Cancel</button>
                </div>
            </form>
        </dialog>
    );

}

export default DeleteConfirmationModal;