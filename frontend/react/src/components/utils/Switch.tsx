import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthData } from "../../contexts/AuthProviderContext";
import "../../styles/components/utils/modal.css";
import { ErrorType } from "../../types";
import {TwoFACodeDto} from "../../dtos/twofacode.dto";

const Switch = (): JSX.Element => {
  const [code, setCode] = useState<string>("");
  const [src, setSrc] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [tick, setTick] = useState<boolean>(false);
  const { isTwoFa, updateIsTwoFa, setError } = useAuthData();

  useEffect((): void => {
    if (isTwoFa) {
      setTick(true);
    }
  }, [isTwoFa]);

  const generateTwoFA = async (): Promise<void> => {
    const res: Response = await fetch("http://82.165.70.203:3000/auth/2fa/generate", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (res.ok) {
      const myblobi: Blob = await res.blob();
      const blobURL: string = URL.createObjectURL(myblobi);
      setSrc(blobURL);
      /*
      const image = document.getElementById("myImg");
      if (!image) {
        return;
      }
      image.onload = function () {
        URL.revokeObjectURL(src);
      };
       */
      handleShow();
    } else {
      const err: ErrorType = await res.json();
      setError(err);
    }
  };

  const checkVal = (value: string): boolean => {
    for (let i = 0; i < value.length; i++) {
      if (value[i] < "0" || value[i] > "9") {
        return false;
      }
    }
    return true;
  };

  const activateTwoFa = async (): Promise<void> => {
    if (!checkVal(code) && code.length !== 6) {
      return;
    }
    const twofa: TwoFACodeDto = {
      twoFACode: code,
    }
    const res: Response = await fetch("http://82.165.70.203:3000/auth/2fa/activate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(twofa),
    })
    if (res.ok) {
       handleClose();
       handleTick();
       setCode("");
       return;
    } else {
       const errmsg: ErrorType = await res.json();
       setCode("");
       setError(errmsg);
       return;
    }
  };

  const deactivateTwoFA = async (): Promise<void> => {
      const res: Response = await fetch(
          "http://82.165.70.203:3000/auth/2fa/deactivate",
          {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        handleUnTick();
        updateIsTwoFa(false);
        return;
      } else {
        const err: ErrorType = await res.json();
        setError(err);
      }
  };

  const handleTick = (): void => setTick(true);
  const handleUnTick = (): void => setTick(false);

  const handleToggle = (): void => {
    if (tick) {
      deactivateTwoFA();
    }
    if (!tick) {
      generateTwoFA();
    }
  };

  const handleSubmit = (evt: any): void => {
    evt.preventDefault();
  };

  const handleChange = (evt: any): void => {
    evt.preventDefault();
    setCode(evt.target.value);
  };

  const cancelling = (): void => {
    setCode("");
    handleClose();
  };

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);

  return (
    <div className="activation">
      <Modal show={show} id="ModalCode" onHide={handleClose}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>Two Factor Authentication</h2>
            <img alt="qrcode" src={src} />
          </Modal.Header>
          <Modal.Body>
            <Form className="mb-3">
              <input
                type="text"
                placeholder="2fa activation code"
                maxLength={6}
                id="code"
                name="code"
                onChange={handleChange}
                value={code}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="mx-1" onClick={cancelling}>
              Cancel
            </Button>
            <Button onClick={activateTwoFa} className="mx-1">
              Validate
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
      <form onSubmit={handleSubmit}>
        <label>
          2fa
          <input type="checkbox" checked={tick} onChange={handleToggle} />
        </label>
      </form>
    </div>
  );
};

export default Switch;
