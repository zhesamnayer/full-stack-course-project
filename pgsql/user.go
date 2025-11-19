package pgsql

import (
	"context"
	"errors"
	"full-stack-project/domain"

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
	user.Username = username
	user.Password = password
	user.Email = email
	user.Role = role

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
	user.Username = name
	user.Email = email
	user.Role = role

	// Save the user
	err := r.conn.Save(&user).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *PqsqlRepo) DeleteUser(ctx context.Context, id uint) error {
	err := r.conn.Delete(domain.User{}, "ID = ?", id).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *PqsqlRepo) CheckUserCredentials(ctx context.Context, username, password string) error {
	var user *domain.User
	err := r.conn.Model(&domain.User{}).Where("user_name = ? and password = ?", username, password).Find(&user).Error
	if err != nil {
		return err
	}

	if user.Username != username {
		return errors.New("user not found")
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

func (r *PqsqlRepo) GetUserInfo(ctx context.Context, username string) (*domain.User, error) {
	var user domain.User
	err := r.conn.Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
