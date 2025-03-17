import { z } from 'zod'
import { procedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'

import { Redis } from '@upstash/redis'
import { TLStoreSnapshot } from 'tldraw'

const redis = Redis.fromEnv()

const TLDRAW_DOCUMENT_KEY = 'tldraw_document'

export const documentRouter = router({
  save: procedure
    .input(
      z.object({
        document: z.custom<TLStoreSnapshot>(
          (data) => {
            if (typeof data !== 'object' || data === null) {
              return false
            }

            return true
          },
          {
            message: 'Must be a valid TLStoreSnapshot'
          }
        )
      })
    )
    .mutation(async ({ input }) => {
      try {
        await redis.set(TLDRAW_DOCUMENT_KEY, input.document)
        return {
          success: true
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save document',
          cause: error
        })
      }
    }),
  load: procedure.query(async () => {
    try {
      const document = await redis.get(TLDRAW_DOCUMENT_KEY)

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found'
        })
      }

      return {
        document
      }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve document',
        cause: error
      })
    }
  })
})
