import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AvatarType, ErrorType } from "../../types";

const ModalChangeAvatar = (): JSX.Element => {
  const { updateUser, setError, user } = useAuthData();
  const [show, setShow] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState<AvatarType>({url:"", hash: 0});

  useEffect((): void => {
    if (user.avatar) {
      setAvatarUrl({
        url: "http://82.165.70.203:3000/user/" + user.auth_id + "/avatar",
        hash: Date.now()});
    }
  }, [user])

  const requestChangeAvatar = async (): Promise<void> => {
    const formData: FormData = new FormData();
    if (!selectedImage) {
      return;
    }
    formData.append("picture", selectedImage);
    const params: any = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    };
    delete params.headers["Content-Type"];
    const res: Response = await fetch("http://82.165.70.203:3000/user/upload",
        params);
    if (res.ok) {
      const str: any = await res.json();
      //const avatar: string = "http://82.165.70.203:3000/user/" + user.auth_id + "/avatar/" + Date.now();
      updateUser(str.avatar, null);
      setSelectedImage(null);
      handleClose();
    } else {
      setSelectedImage(null);
      const err: ErrorType = await res.json();
      setError(err);
      //HandleError(err);
    }
  };

  const cancelling = (): void => {
    setSelectedImage(null);
    handleClose();
  };

  const handleImage = (evt: any): void => {
    if (evt.target) {
      setSelectedImage(evt.target.files[0]);
    }
  };

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);

  return (
    <div className="changeavatar">
      <Modal show={show} id="" onHide={handleClose}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>Change Avatar</h2>
          </Modal.Header>
          <Modal.Body>
            {selectedImage && (
              <div>
                <img
                  alt=""
                  width="250px"
                  src={URL.createObjectURL(selectedImage)}
                />
                <br />
                <Button
                    onClick={() => setSelectedImage(null)}>
                  Remove
                </Button>
              </div>
            )}
            <Form className="mb-3">
              <input
                type="file"
                maxLength={30}
                id="username"
                name="avatar"
                onChange={handleImage}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="mx-1" onClick={cancelling}>
              Cancel
            </Button>
            <Button onClick={requestChangeAvatar} className="mx-1">
              Validate
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
      <button className="btnAvatar" onClick={() => handleShow()}>
        <img
            className="modifAvatar mb-2"
            width={100}
            height={100}
            src={`${avatarUrl.url}?${avatarUrl.hash}`}
            alt="prout"
        />
      </button>
    </div>
  );
};
export default ModalChangeAvatar;
