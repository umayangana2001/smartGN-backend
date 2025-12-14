async getRequestByDivisionAndId(division: string, requestId: string) {
  const request = await this.prisma.serviceRequest.findFirst({
    where: {
      id: requestId,
      user: {
        profile: {
          division: division,
        },
      },
    },
    include: {
      serviceType: true,
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!request) {
    throw new NotFoundException(
      'Request not found for this division',
    );
  }

  return request;
}