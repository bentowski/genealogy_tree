import Request from "./Requests";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { Button, Modal } from "react-bootstrap";
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap';
import { UserType } from "../../types";
import {UpdateUsernameDto} from "../../dtos/update-user.dto";

const ModalChangeUsername = (): JSX.Element => {
  const { user, updateUser, setError } = useAuthData();
  const [field, setField] = useState<string>("");
  const navigate = useNavigate();
  const [err, setErr] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('');

  const getUsers = async (): Promise<UserType[]|undefined> => {
    try {
      const users: UserType[] = await Request(
          "GET",
          {},
          {},
          "http://82.165.70.203:3000/user/"
      );
      return users;
    } catch (error) {
      setError(error);
    }
  }

  useEffect((): void => {
    if (user) {
      setUsername(user.username)
    }
  }, [user])

  const verifField = async (): Promise<boolean> => {
    const users: UserType[] | undefined = await getUsers();
    var regex: RegExp = /^[\w-]+$/
    var minmax: RegExp = /^.{3,10}$/

    if (!regex.test(field)) {
      setErr("Non valid character")
      setAlert(true);
      // setTimeout(() => {
      //   setErr("")
      // }, 1800)
      return false;
    }
    else if (!minmax.test(field)) {
      setErr("Username must contains between 3 and 10 characters")
      setAlert(true);
      // setTimeout(() => {
      //   setErr("")
      // }, 1800)
      return false;
    }
    else if (users !== undefined && users.findIndex((u: UserType) => u.username === field) > -1) {
      setErr("This username already exists")
      setAlert(true);
      // setTimeout(() => {
      //   setErr("")
      // }, 1800)
      return false;
    }
    return true;
  }

  const requestChangeUsername = async (): Promise<void> => {
    const ret: boolean = await verifField();
    if (ret) {
      try {
        const req: UpdateUsernameDto = { username: field }
        const res: UserType = await Request(
            "PATCH",
            {
              "Content-Type": "application/json",
            },
            req,
            "http://82.165.70.203:3000/user/update/username"
        )
        if (res) {
          const newName: string = field;
          updateUser(null, field);
          setField("");
          handleClose();
          navigate("/profil/" + newName);
        }
      } catch (error) {
        setError(error);
        setField("");
      }
    }
  };

  const handleChange = (evt: any): void => {
    evt.preventDefault();
    setField(evt.target.value);
  };

  const cancelling = (): void => {
    setAlert(false);
    setErr("");
    setField("");
    handleClose();
  };

  const handleClose = (): void => {
    setShow(false);
  }

  const handleShow = (): void => {
    setShow(true);
  }

  const closeAlert = (): void => {
    setAlert(false);
    setErr("");
  }

  const pressEnter = (e: any): void => {
    if(e.key === 'Enter') {
      requestChangeUsername()
    }
  }

  return (
    <div className="changeusername">
      <Modal show={show} onHide={handleClose}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>Change Username</h2>
          </Modal.Header>
          <Modal.Body>
            {/* <Form className="mb-3"> */}
              <input
                type="text"
                placeholder="new username"
                maxLength={30}
                id="username"
                name="username"
                onChange={handleChange}
                onKeyDown={pressEnter}
                value={field}
              />
            {/* </Form> */}
            <div>
              {alert ?
                <Alert
                    onClose={closeAlert}
                    variant="danger"
                    dismissible>{err}</Alert> :
                // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                <div />
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            {<Button className="mx-1" onClick={cancelling}>
              Cancel
            </Button>}
           { <Button onClick={requestChangeUsername} className="mx-1">
              Validate
            </Button>}
          </Modal.Footer>

        </div>
      </Modal>
      <button
          onClick={handleShow}
          className="btnUsername d-flex flex-row justify-content-start align-items-center"
      >
        <h3>{username}</h3>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-fill mx-2"
            viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </button>
    </div>
  );
};
export default ModalChangeUsername;
