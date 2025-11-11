package pgsql

import (
	"context"
	"errors"
	"full-stack-project/domain"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (r *PqsqlRepo) ListUsers(ctx context.Context) (users []*domain.User, err error) {
	err = r.conn.Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (r *PqsqlRepo) AddUser(ctx context.Context, username, password, email, role string) error {

	user := domain.User{}
	user.UserName = username
	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	user.Password = string(passwordHash)
	user.Email = email
	user.RoleName = role

	err := r.conn.Create(&user).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) UpdateUser(ctx context.Context, id uint, name, email, role string) error {

	// Finding the user
	var user domain.User
	r.conn.Find(&user).Where("ID = ", id)

	// Update the user information
	user.UserName = name
	user.Email = email
	user.RoleName = role

	// Save the user
	err := r.conn.Save(&user).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *PqsqlRepo) DeleteUser(ctx context.Context, id uint) error {
	err := r.conn.Delete(domain.User{}).Where("ID = ?", id).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) CheckUserCredentials(ctx context.Context, username, password string) error {
	var user *domain.User
	err := r.conn.Model(&domain.User{}).Where("user_name = ?", username).Find(&user).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *PqsqlRepo) ChangePassword(username, password string) (err error) {
	err = r.conn.Model(domain.User{}).Where("user_name = ?", username).Update("password", password).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("user not found")
	}
	return nil
}
