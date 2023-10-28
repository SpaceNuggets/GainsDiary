

const RemoveRowButton = (props) => {
  const { onDeleteClick, data } = props;

  const handleDeleteClick = () => {
    onDeleteClick(data);
  };

  return <button onClick={handleDeleteClick}>Delete</button>;
};
export default RemoveRowButton