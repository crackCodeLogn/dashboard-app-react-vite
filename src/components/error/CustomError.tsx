const CustomError = (params: { errorMsg: string }) => {
  return (
    <div className={'error'}>{params.errorMsg}</div>
  )
};

export default CustomError;