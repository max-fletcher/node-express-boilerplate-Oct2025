import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { LanguageService } from '../../services/admin/language.services';
import { BadRequestException } from '../../errors/BadRequestException.error';

const languageService = new LanguageService();

export async function getAllLanguages(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    let languages = null
    if(page && limit)
      languages = await languageService.getPaginatedLanguages(page, limit, sortOrder, sortBy, searchText);
    else
      languages = await languageService.getAllLanguages();

    return res.status(200).json({
      data: {
        message: 'Language list fetched successfully!',
        languages: languages,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllLanguages', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function getSingleLanguage(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const languageId = req.params.id
    const language = await languageService.findLanguageById(languageId, null);

    if(!language)
      throw new NotFoundException('Language not found.')
    if(language.deletedAt)
      throw new NotFoundException('Language not found.')

    return res.status(200).json({
      data: {
        message: 'Language fetched successfully!',
        language: language,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getSingleAllLanguage', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function createLanguage(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const data = { ...req.body, updatedBy: req.user!.id }
    const response = await languageService.storeLanguage(data);

    if(response)
      return res.status(201).json({
        data: {
          message: 'Language created successfully!',
          language: response,
        },
        statusCode: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('createLanguage', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function updateLanguage(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const languageId = req.params.id
    const language = await languageService.findLanguageById(languageId, ['id', 'deletedAt'])
    if(!language)
      throw new NotFoundException('Language not found.')
    if(language.deletedAt)
      throw new NotFoundException('Language not found.')

    const data = { ...req.body, updatedBy: req.user!.id }

    const response = await languageService.updateLanguage(data, languageId);

    if(response){
      const language = await languageService.findLanguageById(languageId);
      return res.json({
        data: {
          message: 'Language updated successfully!',
          language: language,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateLanguage', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function deleteLanguage(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const languageId = req.params.id

    const language = await languageService.findLanguageById(languageId)
    if(!language)
      throw new NotFoundException('Language not found.')
    if(language.deletedAt)
      throw new NotFoundException('Language not found.')

    const response = await languageService.deleteLanguage(languageId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'Language deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('deleteLanguage', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}