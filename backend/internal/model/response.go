package model

type ErrorResponse struct {
  Error struct {
    Code    string `json:"code"`
    Message string `json:"message"`
  } `json:"error"`
}

type Ok struct {
  Status string `json:"status"`
}